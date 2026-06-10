const poolChecklist = [
  'Pool-с connection авсан бол заавал release() хий',
  'Transaction хийхдээ pool.query() биш нэг connection дээр ажиллуул',
  'connectionLimit-г хэт их тавихгүй, MySQL max_connections-тэй уялдуул',
  'enqueue event их гарвал query эсвэл pool size-аа шалга',
]

const replicaChecklist = [
  'INSERT, UPDATE, DELETE бүх бичилт Primary руу явна',
  'SELECT, тайлан, analytics уншилт Replica руу явж болно',
  'Replication lag бодит тул өөрийн бичсэн өгөгдлийг Primary-с унших хэрэгтэй',
  'Жижиг app-д replica заавал хэрэггүй, Redis cache илүү энгийн шийдэл байж болно',
]

function DatabaseGuide() {
  return (
    <div className="database-page">
      <section className="database-hero">
        <div className="database-hero-copy">
          <span className="database-kicker">MySQL Architecture</span>
          <h1 className="database-title">Connection Pool & Read Replica</h1>
          <p className="database-desc">
            Backend app олон хэрэглэгчтэй болох үед MySQL холболт, уншилт, бичилтийн ачааллыг зөв удирдах үндсэн ойлголтууд.
          </p>
        </div>
        <div className="database-flow" aria-hidden="true">
          <span>Client</span>
          <i></i>
          <span>API</span>
          <i></i>
          <span>Pool</span>
          <i></i>
          <span>MySQL</span>
        </div>
      </section>

      <section className="database-grid">
        <article className="database-card database-card-large">
          <div className="database-card-num">01</div>
          <h2>Connection Pool гэж юу вэ?</h2>
          <p>
            Өгөгдлийн сантай харилцах бүрт шинэ connection үүсгэх нь үнэтэй. TCP холболт, authentication, session тохиргоо
            нийлээд 20-100мс зарцуулж болно. Connection Pool нь урьдчилан үүсгэсэн холболтуудыг дахин ашиглаж request бүрийг
            илүү хурдан, тогтвортой болгодог.
          </p>
          <pre>{`Request -> free connection -> query -> release

[conn 1] [conn 2] [busy] [free]
             ^ дахин ашиглана`}</pre>
        </article>

        <article className="database-card">
          <div className="database-card-num">02</div>
          <h2>Pool-ийн зөв тохиргоо</h2>
          <ul>
            <li><strong>connectionLimit:</strong> жижиг app-д 5-10, production-д 10-20 байж болно.</li>
            <li><strong>waitForConnections:</strong> true байвал pool дүүрсэн үед queue-д хүлээнэ.</li>
            <li><strong>queueLimit:</strong> хэт олон request хүлээхээс хамгаална.</li>
            <li><strong>connectTimeout:</strong> холболт удах үед timeout өгнө.</li>
          </ul>
        </article>

        <article className="database-card">
          <div className="database-card-num">03</div>
          <h2>Transaction ба release</h2>
          <p>
            Transaction үед бүх query нэг connection дээр явах ёстой. Connection авсан бол амжилттай эсвэл алдаатай ямар ч үед
            finally дотор release хийх нь хамгийн чухал.
          </p>
          <pre>{`const conn = await pool.getConnection()
try {
  await conn.beginTransaction()
  await conn.query('UPDATE ...')
  await conn.commit()
} finally {
  conn.release()
}`}</pre>
        </article>

        <article className="database-card database-card-accent">
          <div className="database-card-num">04</div>
          <h2>Prisma + MySQL дээр</h2>
          <p>
            Энэ project Prisma ашиглаж байгаа тул raw MySQL2 pool-г controller бүрт гараар ашиглах шаардлагагүй. Prisma өөрийн
            connection management-тэй, харин pool хэмжээ зэрэг тохиргоог DATABASE_URL параметрээр удирдаж болно.
          </p>
          <code>DATABASE_URL=mysql://user:pass@host:3306/db?connection_limit=5&pool_timeout=10</code>
        </article>
      </section>

      <section className="database-split">
        <article className="database-panel">
          <h2>Connection Pool санах зүйлс</h2>
          {poolChecklist.map((item) => (
            <div className="database-check" key={item}>
              <span></span>
              <p>{item}</p>
            </div>
          ))}
        </article>

        <article className="database-panel">
          <h2>Read Replica гэж юу вэ?</h2>
          <p>
            Read Replica нь Primary MySQL database-ийн хуулбар. Primary дээрх өөрчлөлт binary log-оор дамжин replica дээр
            синхрончлогдоно. Ихэнх web app дээр request-ийн 70-90% нь уншилт байдаг тул SELECT query-г replica руу чиглүүлж
            Primary-ийн ачааллыг бууруулж болно.
          </p>
          <pre>{`Write -> Primary
Read  -> Replica

Primary -> Binary Log -> Relay Log -> Replica`}</pre>
        </article>
      </section>

      <section className="database-grid database-grid-two">
        <article className="database-card">
          <div className="database-card-num">05</div>
          <h2>Replication Lag</h2>
          <p>
            Primary дээр бичигдсэн өгөгдөл replica дээр шууд тусахгүй байж болно. Энэ хоцрогдлыг replication lag гэдэг.
            Тиймээс хэрэглэгч өөрийн profile эсвэл саяхан үүсгэсэн guide-аа харах үед Primary-с унших нь зөв.
          </p>
        </article>

        <article className="database-card">
          <div className="database-card-num">06</div>
          <h2>Хэзээ хэрэгтэй вэ?</h2>
          <ul>
            <li>Уншилтын ачаалал маш их үед</li>
            <li>Тайлан, analytics query Primary-г удаашруулж байвал</li>
            <li>Өндөр availability шаардлагатай үед</li>
            <li>Жижиг beginner project-д эхлээд pool + cache хангалттай</li>
          </ul>
        </article>
      </section>

      <section className="database-panel database-final">
        <h2>Gaming Guide Site-д зөв хэрэглэх нь</h2>
        <div className="database-final-grid">
          {replicaChecklist.map((item) => (
            <div className="database-check" key={item}>
              <span></span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DatabaseGuide
