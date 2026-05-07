import { useEffect, useState } from 'react';

export default function useActiveSection(ids, { rootMargin = '-40% 0px -55% 0px' } = {}) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!ids || ids.length === 0) return;
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join('|'), rootMargin]);

  return active;
}
