import ts from "typescript";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
const dir = await mkdtemp(join(tmpdir(), "phoolish-cart-"));
try {
  for (const [src, dest] of [
    ["data/products.ts", "products.mjs"],
    ["lib/cart.ts", "cart.mjs"],
  ]) {
    const input = (await readFile(src, "utf8")).replace(
      /[@]\/data\/products/g,
      "./products.mjs",
    );
    await writeFile(
      join(dir, dest),
      ts.transpileModule(input, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ES2022,
        },
      }).outputText,
    );
  }
  const { initialState, addLine, updateLine, sanitizeState, totals } =
    await import(pathToFileURL(join(dir, "cart.mjs")).href);
  let tests = 0;
  function test(name, fn) {
    fn();
    tests++;
    console.log("PASS", name);
  }
  test("Empty cart has zero INR totals", () =>
    assert.deepEqual(totals(initialState), {
      subtotal: 0,
      discount: 0,
      total: 0,
      count: 0,
    }));
  let state = addLine(initialState, "mini-bouquet", "Pastel mix", 2);
  test("Adds two products at correct price", () =>
    assert.equal(totals(state).subtotal, 698));
  state = addLine(state, "mini-bouquet", "Pastel mix", 1);
  test("Same options merge into one line", () =>
    assert.equal(state.cart.length, 1));
  test("Merged quantity equals three", () =>
    assert.equal(state.cart[0].quantity, 3));
  state = addLine(state, "mini-bouquet", "Blush pink", 1);
  test("Different variants remain separate", () =>
    assert.equal(state.cart.length, 2));
  test("Aggregate stock prevents overflow across variants", () =>
    assert.throws(() => addLine(state, "mini-bouquet", "Blush pink", 9)));
  test("Rejects nonexistent product", () =>
    assert.throws(() => addLine(state, "unknown", "Pastel mix", 1)));
  test("Rejects nonexistent variant", () =>
    assert.throws(() => addLine(state, "mini-bouquet", "No such colour", 1)));
  test("Rejects sold out item", () =>
    assert.throws(() => addLine(state, "flower-keychain", "Butter yellow", 1)));
  test("Rejects negative, zero, fractional and nonfinite quantities", () => {
    for (const q of [-1, 0, 1.5, Infinity, NaN])
      assert.throws(() => addLine(state, "mini-bouquet", "Pastel mix", q));
  });
  test("Personalized item requires a name", () =>
    assert.throws(() => addLine(state, "bag-charm", "Pastel mix", 1, "   ")));
  test("Personalization respects maximum length", () =>
    assert.throws(() =>
      addLine(state, "bag-charm", "Pastel mix", 1, "12345678901"),
    ));
  let custom = addLine(initialState, "bag-charm", "Pastel mix", 1, " Asha ");
  custom = addLine(custom, "bag-charm", "Pastel mix", 1, "Mira");
  test("Different personalization creates separate lines", () =>
    assert.equal(custom.cart.length, 2));
  test("Trims personalization", () =>
    assert.equal(custom.cart[0].personalization, "Asha"));
  const updated = updateLine(state, state.cart[0].key, 100);
  test("Quantity update clamps to remaining stock", () =>
    assert.equal(updated.cart[0].quantity, 11));
  test("Quantity cannot become zero via update", () =>
    assert.deepEqual(updateLine(state, state.cart[0].key, 0), state));
  test("Demo coupon applies correct rounded discount", () =>
    assert.deepEqual(
      totals({ ...initialState, cart: custom.cart, coupon: "JOY10" }),
      { subtotal: 598, discount: 60, total: 538, count: 2 },
    ));
  test("Unknown coupons give no discount", () =>
    assert.equal(totals({ ...state, coupon: "BAD" }).discount, 0));
  test("Round-trip preserves valid cart and wishlist", () => {
    const input = { ...state, wishlist: ["mini-bouquet"], coupon: "JOY10" };
    assert.deepEqual(sanitizeState(JSON.parse(JSON.stringify(input))), input);
  });
  test("Corrupted saved data recovers safely", () => {
    for (const value of [
      null,
      [],
      42,
      "bad",
      {
        cart: [null, {}, { productId: "gone" }],
        wishlist: [null, 3, "gone"],
        coupon: "BAD",
      },
    ])
      assert.deepEqual(sanitizeState(value), initialState);
  });
  test("Restored wishlist removes duplicates and unknown IDs", () =>
    assert.deepEqual(
      sanitizeState({ wishlist: ["mini-bouquet", "mini-bouquet", "gone"] })
        .wishlist,
      ["mini-bouquet"],
    ));
  test("Restored cart rechecks current inventory", () =>
    assert.equal(
      sanitizeState({ ...state, cart: [{ ...state.cart[0], quantity: 999 }] })
        .cart[0].quantity,
      12,
    ));
  test("Restore removes products now sold out", () =>
    assert.equal(
      sanitizeState({
        cart: [
          {
            productId: "flower-keychain",
            variant: "Butter yellow",
            quantity: 1,
          },
        ],
      }).cart.length,
      0,
    ));
  console.log(`${tests} cart tests passed.`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
