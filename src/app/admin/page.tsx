export default function AdminPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Şimdilik admin paneli yok. İçerik yönetimi Prisma Studio üzerinden.</p>

      <ul style={{ marginTop: 12 }}>
        <li>
          Prisma Studio: <code>http://localhost:5555</code>
        </li>
        <li>
          Site: <code>http://localhost:3000</code>
        </li>
      </ul>

      <p style={{ marginTop: 12 }}>
        “Publish” butonu için bir sonraki adımda gerçek admin ekranı + API endpoint ekleyeceğiz.
      </p>
    </main>
  );
}
