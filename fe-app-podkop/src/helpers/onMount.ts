export async function onMount(
  id: string,
  timeout = 30000,
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const el = document.getElementById(id);

    if (el && el.offsetParent !== null) {
      return resolve(el);
    }

    let io: IntersectionObserver | null = null;

    const cleanup = () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      if (io) io.disconnect();
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`onMount: element #${id} not found within ${timeout}ms`));
    }, timeout);

    const observer = new MutationObserver(() => {
      const target = document.getElementById(id);
      if (target) {
        io = new IntersectionObserver((entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          if (visible) {
            cleanup();
            resolve(target);
          }
        });

        io.observe(target);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
