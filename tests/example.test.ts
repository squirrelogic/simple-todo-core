describe('Example Test Suite', () => {
  it('should pass a basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should perform basic math operations', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
    expect(20 / 4).toBe(5);
  });

  it('should handle string operations', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('Hello');
    expect(greeting.length).toBe(13);
    expect(greeting.toLowerCase()).toBe('hello, world!');
  });
});