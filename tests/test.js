describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(false);
    });
});

describe( "CSS", function () {
    it("CSS", function () {
        expect(Convert(12, "in").to("cm")).toEqual(30.48);
    });

    it("CSS", function () {
        expect(Convert(2000, "cm").to("yards")).toEqual(21.87);
    });
});
