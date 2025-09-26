import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

export default function CoursePage({ course, paid }) {
  if (!course) return <div>Not found</div>
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      {!paid ? (
        <p>You need to purchase access. <a href="/checkout" className="text-blue-600">Buy now</a></p>
      ) : (
        course.lessons.map(lesson => (
          <div key={lesson.id} className="mb-6">
            <h3 className="font-semibold">{lesson.title}</h3>
            <LessonPlayer lesson={lesson} />
          </div>
        ))
      )}
    </div>
  )
}

function LessonPlayer({ lesson }) {
  if (lesson.sourceType === 'youtube') {
    return <iframe className="w-full h-80 rounded" src={`https://www.youtube.com/embed/${lesson.videoUrl}?rel=0&modestbranding=1`} frameBorder="0" allowFullScreen />
  }
  if (lesson.sourceType === 'external') {
    return <iframe className="w-full h-80 rounded" src={lesson.videoUrl} frameBorder="0" allowFullScreen />
  }
  // self
  return <video controls className="w-full h-80 rounded"><source src={lesson.videoUrl} type="video/mp4" /></video>
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  const slug = ctx.params.slug
  const course = await prisma.course.findUnique({ where: { slug }, include: { lessons: true } })

  // simple paid check: if logged in and has purchase record
  let paid = false
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { purchases: true } })
    if (user && user.purchases.length > 0) paid = true
  }

  return { props: { course: course || null, paid } }
}
