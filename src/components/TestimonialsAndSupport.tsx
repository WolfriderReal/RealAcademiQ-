import React from 'react';

const testimonials = [
  {
    name: 'Jane M',
    rating: 5,
    feedback: 'RealAcademiQ helped me achieve my academic goals. Highly recommended!'
  },
  {
    name: 'John M',
    rating: 4,
    feedback: 'Great platform with excellent support. Would use again.'
  },
  {
    name: 'Amina K.',
    rating: 5,
    feedback: 'The resources and guidance were top-notch. Thank you!'
  },
  {
    name: 'Wanjiku Mwangi',
    rating: 5,
    feedback: 'Nilipata msaada bora sana kwa thesis yangu. Nashukuru RealAcademiQ!'
  },
  {
    name: 'Carlos Rodriguez',
    rating: 4,
    feedback: 'Excellent academic support, especially for my engineering project.'
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    feedback: 'The team was very professional and delivered my assignment on time.'
  },
  {
    name: 'Fatima Hassan',
    rating: 5,
    feedback: 'I improved my grades thanks to their expert guidance.'
  },
  {
    name: 'Liam O’Connor',
    rating: 4,
    feedback: 'Great service and very responsive support.'
  },
  {
    name: 'Wycliffe Otieno',
    rating: 5,
    feedback: 'RealAcademiQ iliniwezesha kumaliza project yangu ya mwisho chuoni. Asante!'
  },
  {
    name: 'Emily Wang',
    rating: 5,
    feedback: 'Very helpful and reliable academic assistance.'
  },
  {
    name: 'Grace Njeri',
    rating: 5,
    feedback: 'Huduma zao ni za kipekee na zinasaidia sana wanafunzi.'
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? '' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ))}
    </span>
  );
}

export default function TestimonialsAndSupport() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-center md:text-left">Testimonials</h2>
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-semibold mb-2 md:mb-1">Support My Work</h3>
            <p className="mb-2 md:mb-1 text-sm">If you are a well-wisher or donor and would like to support RealAcademiQ, click below:</p>
            <a
              href="https://www.paypal.com/donate?business=kstrategic_Inc@outlook.com&currency_code=USD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition"
            >
              Donate with PayPal
            </a>
          </div>
        </div>
        <div className="space-y-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded shadow text-center">
              <StarRating rating={t.rating} />
              <p className="mt-4 text-lg italic">&quot;{t.feedback}&quot;</p>
              <p className="mt-2 font-semibold">- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
