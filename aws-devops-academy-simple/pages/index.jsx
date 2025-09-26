import Link from 'next/link'
import prisma from '../lib/prisma'

export default function Home({ courses }) {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">AWS & DevOps Academy</h1>
      <Link href="/checkout"><a className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded">Buy Course (₹499)</a></Link>
      <div className="grid gap-4">
        {courses.map(c => (
          <div key={c.id} className="p-4 border rounded">
            <h2 className="text-xl">{c.title}</h2>
            <Link href={`/course/${c.slug}`}><a className="text-blue-600">Open</a></Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const courses = await prisma.course.findMany({ include: { lessons: true } })
  return { props: { courses } }
}
