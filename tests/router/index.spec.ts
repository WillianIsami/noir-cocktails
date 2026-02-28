vi.mock('@/views/HomeView.vue', () => ({
  default: { template: '<div>home</div>' },
}));

vi.mock('@/views/FavoritesView.vue', () => ({
  default: { template: '<div>favorites</div>' },
}));

vi.mock('@/views/DrinkDetailsView.vue', () => ({
  default: { template: '<div>details</div>' },
}));

describe('router', () => {
  it('exposes expected route names and metadata', async () => {
    vi.resetModules();
    const { default: router } = await import('@/router');
    const names = router.getRoutes().map((route) => route.name);

    expect(names).toContain('home');
    expect(names).toContain('favorites');
    expect(names).toContain('drink-details');
    expect(
      router.getRoutes().find((route) => route.name === 'home')?.meta.titleKey,
    ).toBe('routes.homeTitle');
  });

  it('keeps scroll position on query-only changes', async () => {
    vi.resetModules();
    const { default: router } = await import('@/router');
    const scrollBehavior = router.options.scrollBehavior;

    expect(scrollBehavior?.(
      { path: '/', query: { page: '2' } } as never,
      { path: '/', query: { page: '1' } } as never,
      undefined,
    )).toBe(false);

    expect(scrollBehavior?.(
      { path: '/favorites' } as never,
      { path: '/' } as never,
      undefined,
    )).toEqual({ top: 0, behavior: 'smooth' });
  });
});
