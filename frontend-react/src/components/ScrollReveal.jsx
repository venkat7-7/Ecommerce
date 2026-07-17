import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionClass = {
    up: 'reveal-up',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[direction] || 'reveal-up';

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${directionClass} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
