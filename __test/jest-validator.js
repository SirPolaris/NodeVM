// Test Testing File

// This will normally be a require to the parent. Simulated here.
function sum(x, y) {
    return x + y;
}

// Test that sum function we brought in.
test('Makes Bananas', () => {
    expect(sum(1, 2)).toBe(3)
})