export const cn = (...tokens: Array<string | false | null | undefined>) =>
  tokens.filter(Boolean).join(' ');
