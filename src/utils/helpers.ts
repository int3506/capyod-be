export const mappingClass = <D extends object, S extends object>(
  dest: D,
  source: S,
) => {
  for (const key in source) {
    if (key in dest)
      dest[key as unknown as keyof D] = (source as any)[
        key as unknown as keyof S
      ];
  }
};
