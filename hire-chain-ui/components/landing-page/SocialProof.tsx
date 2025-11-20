import { Card, CardContent } from "@/components/ui/card";

export default function SocialProof() {
  const stats = [
    { number: "5K+", label: `African Freelancers` },
    { number: "$500K+", label: "Paid in HBAR" },
    { number: "50+", label: "Countries Served" }
  ];

  const testimonials = [
    {
      quote:
        "HireChain gave me access to international clients I never thought possible. Getting paid in HBAR is instant and the fees are incredibly low.",
      author: "Chidinma O.",
      role: "UI/UX Designer, Lagos"
    },
    {
      quote:
        "Finding skilled African developers has been a game-changer for our startup. The talent is exceptional and the blockchain-based payments are seamless.",
      author: "Marcus T.",
      role: "Tech Founder, San Francisco"
    },
    {
      quote:
        "No more waiting weeks for international payments. With HireChain, I receive HBAR immediately and can focus on delivering great work.",
      author: "Amara K.",
      role: "Full Stack Developer, Nairobi"
    }
  ];

  return (
    <div id='stats'>
      <section className='wrapper'>
        <div className='max-w-7xl mx-auto lg:px-8 mt-10'>
          <p className='text-white  text-center capitalize text-lg mb-7 '>
            We believe and trust the process
          </p>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-8 mb-24'>
            {stats.map((stat) => (
              <div key={stat.label} className='text-center'>
                <p className='text-3xl lg:text-5xl font-shinko text-white mb-2'>
                  {stat.number}
                </p>
                <p className='lg:text-lg text-gray-300/70'>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className='px-1' id='testimonials'>
            <h3 className='text-2xl font-bold text-white font-[shinko] text-center mb-12'>
              What Our Community <br className={`block md:hidden`} /> Says
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className='bg-black border-purple-500/20'>
                  <CardContent className='pt-6'>
                    <p className='text-white/80 mb-4 italic'>
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className='font-semibold text-white'>
                        {testimonial.author}
                      </p>
                      <p className='text-sm text-foreground/60 '>
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
