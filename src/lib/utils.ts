/**
 * Utilitaires partagés.
 *
 * `cn` fusionne des classes CSS en ignorant les falsy.
 * La version Tailwind (clsx + tailwind-merge) n'est pas nécessaire ici :
 * le projet n'utilise pas Tailwind et n'a donc pas de conflits de classes
 * à résoudre — un simple filtre suffit.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}