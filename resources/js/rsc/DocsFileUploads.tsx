import CodeBlock from './CodeBlock';
import Link from 'lara-bun/Link';

const s = {
  h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 } as const,
  h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 48, marginBottom: 12 } as const,
  h3: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, fontWeight: 600, marginTop: 32, marginBottom: 8 } as const,
  p: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 } as const,
  li: { color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 6, paddingLeft: 8 } as const,
  mono: { fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', monospace", fontSize: 13, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#e4e4e7' } as const,
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '40px 0' } as const,
  accent: { color: '#f59e0b' } as const,
  box: { background: '#18181b', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 } as const,
  table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: 20 } as const,
  th: { textAlign: 'left' as const, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13, fontWeight: 600, color: '#fafafa', fontFamily: "ui-monospace, 'Fira Code', monospace" } as const,
  td: { padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#a1a1aa' } as const,
  warn: { background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 12, padding: 24, marginBottom: 20 } as const,
};

export default function DocsFileUploads() {
  return (
    <div>
      <h1 style={s.h1}>File Uploads</h1>
      <p style={s.p}>
        Server actions support file uploads through regular HTML forms. Files are sent as <span style={s.mono}>FormData</span> via React's Flight protocol, routed through the Unix socket between PHP and Bun, then passed to your action function.
      </p>

      <h2 style={s.h2}>Basic File Upload</h2>
      <p style={s.p}>
        Create a PHP action that receives file data. LaraBun handles binary transport automatically — no manual base64 encoding needed.
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/UploadAvatar.php">
        {`<?php

namespace App\\Rsc\\Actions;

use App\\Models\\User;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Storage;

class UploadAvatar
{
    public function __invoke(string $fileName, string $fileContent): array
    {
        $user = Auth::user();
        $path = 'avatars/' . $user->id . '/' . $fileName;

        Storage::disk('public')->put($path, $fileContent);

        $user->update(['avatar_path' => $path]);

        return ['path' => Storage::disk('public')->url($path)];
    }
}`}
      </CodeBlock>

      <p style={s.p}>
        On the client, read the file and pass it directly to the server action:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/profile/AvatarUpload.tsx">
        {`"use client";

import { useState } from "react";
import { uploadAvatar } from "../server-actions.generated";

export default function AvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const file = formData.get("avatar") as File;
    if (!file || file.size === 0) return;

    setUploading(true);

    try {
      const content = await file.text();
      const result = await uploadAvatar(file.name, content);
      setAvatarUrl(result.path);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="file" name="avatar" accept="image/*" />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Avatar"}
      </button>
      {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
    </form>
  );
}`}
      </CodeBlock>

      <h2 style={s.h2}>Using FormData Directly</h2>
      <p style={s.p}>
        For regular form submissions without files (text fields, checkboxes, etc.), you can pass <span style={s.mono}>FormData</span> values directly to server actions. React's Flight protocol handles serialization automatically.
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/posts/NewPostForm.tsx">
        {`"use client";

import { createPost } from "../server-actions.generated";

export default function NewPostForm() {
  async function handleSubmit(formData: FormData) {
    await createPost(
      formData.get("title") as string,
      formData.get("body") as string,
      formData.get("published") === "on"
    );
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="Post title" required />
      <textarea name="body" placeholder="Write your post..." required />
      <label>
        <input type="checkbox" name="published" />
        Publish immediately
      </label>
      <button type="submit">Create Post</button>
    </form>
  );
}`}
      </CodeBlock>

      <p style={s.p}>
        The corresponding PHP action receives typed arguments — no manual request parsing needed:
      </p>
      <CodeBlock language="php" title="app/Rsc/Actions/CreatePost.php">
        {`<?php

namespace App\\Rsc\\Actions;

use App\\Models\\Post;
use Illuminate\\Support\\Facades\\Auth;

class CreatePost
{
    public function __invoke(string $title, string $body, bool $published): array
    {
        $post = Post::create([
            'user_id' => Auth::id(),
            'title' => $title,
            'body' => $body,
            'is_published' => $published,
        ]);

        return $post->toArray();
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>Multi-File Uploads</h2>
      <p style={s.p}>
        For multiple files, iterate over the file list and send each file's data to the action:
      </p>
      <CodeBlock language="tsx" title="resources/js/rsc/app/gallery/UploadPhotos.tsx">
        {`"use client";

import { useState } from "react";
import { uploadPhotos } from "../server-actions.generated";

export default function UploadPhotos() {
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const files = formData.getAll("photos") as File[];
    if (files.length === 0) return;

    setUploading(true);

    const fileData = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        return { name: file.name, content: base64, type: file.type };
      })
    );

    try {
      await uploadPhotos(fileData);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="file" name="photos" accept="image/*" multiple />
      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Photos"}
      </button>
    </form>
  );
}`}
      </CodeBlock>

      <CodeBlock language="php" title="app/Rsc/Actions/UploadPhotos.php">
        {`<?php

namespace App\\Rsc\\Actions;

use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Storage;

class UploadPhotos
{
    /**
     * @param  array<int, array{name: string, content: string, type: string}>  $files
     */
    public function __invoke(array $files): array
    {
        $paths = [];

        foreach ($files as $file) {
            $path = 'photos/' . Auth::id() . '/' . $file['name'];
            Storage::disk('public')->put($path, base64_decode($file['content']));
            $paths[] = Storage::disk('public')->url($path);
        }

        return ['urls' => $paths];
    }
}`}
      </CodeBlock>

      <h2 style={s.h2}>Configuring the Body Size Limit</h2>
      <p style={s.p}>
        Server action payloads (including file data) pass through the Unix socket between PHP and Bun. By default, the maximum frame size is <span style={s.mono}>1MB</span>. You can adjust this in your config:
      </p>
      <CodeBlock language="php" title="config/bun.php">
        {`'rsc' => [
    // ...
    'body_size_limit' => env('BUN_RSC_BODY_SIZE_LIMIT', '1mb'),
],`}
      </CodeBlock>

      <p style={s.p}>
        Or set it via your <span style={s.mono}>.env</span> file:
      </p>
      <CodeBlock language="env" title=".env">
        {`BUN_RSC_BODY_SIZE_LIMIT=100mb`}
      </CodeBlock>

      <p style={s.p}>
        The value accepts human-readable sizes:
      </p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Value</th>
            <th style={s.th}>Bytes</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={s.td}>512kb</td><td style={s.td}>524,288</td></tr>
          <tr><td style={s.td}>1mb</td><td style={s.td}>26,214,400</td></tr>
          <tr><td style={s.td}>100mb</td><td style={s.td}>104,857,600</td></tr>
          <tr><td style={s.td}>1gb</td><td style={s.td}>1,073,741,824</td></tr>
        </tbody>
      </table>

      <p style={s.p}>
        After changing this value, restart the Bun server for it to take effect:
      </p>
      <CodeBlock language="bash">
        {`php artisan bun:serve`}
      </CodeBlock>

      <h2 style={s.h2}>Memory Considerations</h2>
      <p style={s.p}>
        Server action payloads are buffered entirely in memory on both the PHP and Bun sides. Understanding the data flow helps you choose appropriate limits for your use case.
      </p>

      <h3 style={s.h3}>How the Payload Flows</h3>
      <ol style={{ listStyle: 'none', paddingLeft: 0 }}>
        {[
          'Browser serializes form data (including file bytes) into a single request body',
          'PHP receives the full body via the HTTP request and holds it in memory',
          'PHP JSON-encodes the body into a socket frame and writes it to the Unix socket',
          'Bun reads the frame from the socket, parses the JSON, and reconstructs FormData',
          'Bun passes the decoded arguments to your action function',
        ].map((text, i) => (
          <li key={i} style={{ color: '#d4d4d8', fontSize: 15, lineHeight: 1.8, marginBottom: 8, paddingLeft: 8 }}>
            <span style={{ color: '#f59e0b', fontFamily: "ui-monospace, 'Fira Code', monospace", fontSize: 12, marginRight: 8 }}>{i + 1}.</span>
            {text}
          </li>
        ))}
      </ol>

      <h3 style={s.h3}>Peak Memory Usage</h3>
      <p style={s.p}>
        Because the payload is buffered (not streamed) through the socket, both PHP and Bun hold copies simultaneously. For a file of size <strong style={{ color: '#fafafa' }}>N</strong>:
      </p>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Process</th>
            <th style={s.th}>Memory Usage</th>
            <th style={s.th}>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={s.td}>PHP</td>
            <td style={s.td}>~2-3x N</td>
            <td style={s.td}>Request body + JSON-encoded frame (base64 adds ~33%)</td>
          </tr>
          <tr>
            <td style={s.td}>Bun</td>
            <td style={s.td}>~2-3x N</td>
            <td style={s.td}>Socket buffer + parsed JSON + FormData reconstruction</td>
          </tr>
          <tr>
            <td style={{ ...s.td, color: '#fafafa', fontWeight: 600 }}>Total</td>
            <td style={{ ...s.td, color: '#fafafa', fontWeight: 600 }}>~4-6x N</td>
            <td style={s.td}>Both processes hold the data simultaneously</td>
          </tr>
        </tbody>
      </table>

      <div style={s.warn}>
        <p style={{ color: '#eab308', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Example: 5MB file upload (with limit set to 5mb)</p>
        <p style={{ color: '#d4d4d8', fontSize: 14, lineHeight: 1.7, marginBottom: 0 }}>
          A 5MB file will use approximately 20-30MB of total memory across PHP and Bun during the action call. The memory is released once the action completes and the response is streamed back.
        </p>
      </div>

      <h3 style={s.h3}>Recommendations</h3>
      <ul style={{ listStyle: 'none' }}>
        <li style={s.li}>
          <span style={s.accent}>&#8226;</span> Keep the limit as low as your use case allows. The default <span style={s.mono}>1mb</span> suits most form submissions with images.
        </li>
        <li style={s.li}>
          <span style={s.accent}>&#8226;</span> For large files (videos, archives), consider uploading directly to cloud storage (S3, R2) using pre-signed URLs instead of passing through server actions.
        </li>
        <li style={s.li}>
          <span style={s.accent}>&#8226;</span> If you increase the limit, ensure your PHP <span style={s.mono}>memory_limit</span> and <span style={s.mono}>post_max_size</span> are set accordingly in <span style={s.mono}>php.ini</span>.
        </li>
        <li style={s.li}>
          <span style={s.accent}>&#8226;</span> Monitor memory usage in production if handling concurrent uploads — each in-flight upload consumes the memory independently.
        </li>
      </ul>

      <h3 style={s.h3}>PHP Configuration</h3>
      <p style={s.p}>
        When increasing the body size limit, also check these PHP settings:
      </p>
      <CodeBlock language="env" title="php.ini">
        {`; Must be >= body_size_limit
post_max_size = 100M

; Must be >= post_max_size
upload_max_filesize = 100M

; Must accommodate the ~3x memory multiplier
memory_limit = 512M`}
      </CodeBlock>

      <hr style={s.hr} />
      <p style={s.p}>
        Next: <Link href="/docs/authorization" style={s.accent}>Authorization &rarr;</Link>
      </p>
    </div>
  );
}
