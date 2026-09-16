"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/image-constants";
import {
  MAX_INSTAGRAM_POSTS,
  type InstagramPost,
} from "@/lib/instagram-schema";

export function InstagramPanel() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/instagram");
      const data = (await response.json()) as {
        posts?: InstagramPost[];
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Could not load the grid.");
        return;
      }
      setPosts(data.posts ?? []);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  async function addPhotos(files: File[]) {
    setBusy(true);
    setError("");
    setNotice("");
    let added = 0;
    for (const file of files) {
      if (posts.length + added >= MAX_INSTAGRAM_POSTS) {
        setError(
          `The grid holds ${MAX_INSTAGRAM_POSTS} photos. Remove one first.`
        );
        break;
      }
      const body = new FormData();
      body.append("file", file);
      const uploaded = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const uploadData = (await uploaded.json()) as {
        path?: string;
        error?: string;
      };
      if (!uploaded.ok || !uploadData.path) {
        setError(uploadData.error ?? "The photo did not upload.");
        break;
      }
      const created = await fetch("/api/admin/instagram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: uploadData.path }),
      });
      if (!created.ok) {
        const data = (await created.json()) as { error?: string };
        setError(data.error ?? "Could not add the photo.");
        break;
      }
      added += 1;
    }
    if (added > 0) {
      setNotice(
        added === 1 ? "Photo added to the grid." : `${added} photos added.`
      );
    }
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
    await load();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/admin/instagram/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const data = (await response.json()) as {
        error?: string;
        issues?: Record<string, string[] | undefined>;
      };
      setError(data.issues?.link?.[0] ?? data.error ?? "Could not save that.");
      return false;
    }
    setError("");
    return true;
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= posts.length) return;
    const reordered = [...posts];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setPosts(reordered);
    setBusy(true);
    // Positions are rewritten for the whole grid so the order always matches
    // what the homepage renders.
    for (const [position, post] of reordered.entries()) {
      if (post.position !== position) await patch(post.id, { position });
    }
    setBusy(false);
    await load();
  }

  async function remove(post: InstagramPost) {
    if (!window.confirm("Remove this photo from the grid?")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/instagram/${post.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Could not remove that photo.");
    } else {
      setNotice("Photo removed.");
    }
    setBusy(false);
    await load();
  }

  return (
    <section className="admin-panel">
      <h2>Follow-along grid</h2>
      <p className="admin-hint">
        These photos fill the &ldquo;Work in progress&rdquo; section on the
        homepage. Up to {MAX_INSTAGRAM_POSTS}; square crops look best. The
        section stays hidden while the grid is empty.
      </p>

      <fieldset className="admin-media">
        <legend>Add photos</legend>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          disabled={busy || posts.length >= MAX_INSTAGRAM_POSTS}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) void addPhotos(files);
          }}
        />
        <span className="admin-hint">
          {busy
            ? "Working…"
            : posts.length >= MAX_INSTAGRAM_POSTS
              ? "The grid is full. Remove a photo to add another."
              : `${posts.length} of ${MAX_INSTAGRAM_POSTS} used.`}
        </span>
      </fieldset>

      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      <p role="status" className="admin-notice">
        {notice}
      </p>

      {loading && posts.length === 0 ? (
        <p className="admin-muted">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="admin-muted">
          No photos yet. Add a few and the section appears on the homepage.
        </p>
      ) : (
        <ul className="admin-list instagram-admin-list">
          {posts.map((post, index) => (
            <li key={post.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image} alt="" />
              <div className="admin-list-body">
                <label className="admin-inline-field">
                  Caption <span>(alt text)</span>
                  <input
                    defaultValue={post.caption}
                    maxLength={160}
                    placeholder="Colour experiments, Tuesday"
                    onBlur={(event) => {
                      if (event.target.value !== post.caption) {
                        void patch(post.id, { caption: event.target.value });
                      }
                    }}
                  />
                </label>
                <label className="admin-inline-field">
                  Post link <span>(optional)</span>
                  <input
                    defaultValue={post.link}
                    placeholder="https://instagram.com/p/…"
                    onBlur={(event) => {
                      if (event.target.value !== post.link) {
                        void patch(post.id, { link: event.target.value });
                      }
                    }}
                  />
                </label>
                <div className="admin-list-actions">
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Move earlier in the grid"
                    disabled={busy || index === 0}
                    onClick={() => void move(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    aria-label="Move later in the grid"
                    disabled={busy || index === posts.length - 1}
                    onClick={() => void move(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    className="text-link admin-danger"
                    disabled={busy}
                    onClick={() => void remove(post)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
