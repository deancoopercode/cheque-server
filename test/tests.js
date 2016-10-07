var expect    = require("chai").expect;
var logicController = require("../src/logic.js");

//unit tests to run
describe("Convert numbers to word format", function() {

    it("Convert 5", function() {
      var result = logicController.convertNumber('5');
      expect(result).to.equal("FIVE DOLLARS");
    });

    it("Convert 9", function() {
      var result = logicController.convertNumber('9');
      expect(result).to.equal("NINE DOLLARS");
    });

    it("Convert 83", function() {
      var result = logicController.convertNumber('83');
      expect(result).to.equal("EIGHTY THREE DOLLARS");
    });

    it("Convert 90", function() {
      var result = logicController.convertNumber('90');
      expect(result).to.equal("NINETY DOLLARS");
    });

    it("Convert 900", function() {
      var result = logicController.convertNumber('900');
      expect(result).to.equal("NINE HUNDRED DOLLARS");
    });

    it("Convert 909", function() {
      var result = logicController.convertNumber('909');
      expect(result).to.equal("NINE HUNDRED AND NINE DOLLARS");
    });

    it("Convert 990", function() {
      var result = logicController.convertNumber('990');
      expect(result).to.equal("NINE HUNDRED AND NINETY DOLLARS");
    });

    it("Convert 9009", function() {
      var result = logicController.convertNumber('9009');
      expect(result).to.equal("NINE THOUSAND AND NINE DOLLARS");
    });

    it("Convert 9909", function() {
      var result = logicController.convertNumber('9909');
      expect(result).to.equal("NINE THOUSAND NINE HUNDRED AND NINE DOLLARS");
    });

    it("Convert 6665", function() {
      var result = logicController.convertNumber('6665');
      expect(result).to.equal("SIX THOUSAND SIX HUNDRED AND SIXTY FIVE DOLLARS");
    });

    it("Convert 123.456", function() {
      var result = logicController.convertNumber('123.456');
      expect(result).to.equal("ONE HUNDRED AND TWENTY THREE DOLLARS AND FORTY SIX CENTS");
    });

    it("Convert 90000", function() {
      var result = logicController.convertNumber('90000');
      expect(result).to.equal("NINETY THOUSAND DOLLARS");
    });
    it("Convert 9000000", function() {
      var result = logicController.convertNumber('9000000');
      expect(result).to.equal("NINE MILLION DOLLARS");
    });

    it("Convert 9000009", function() {
      var result = logicController.convertNumber('9000009');
      expect(result).to.equal("NINE MILLION AND NINE DOLLARS");
    });

    it("Convert 9999999", function() {
      var result = logicController.convertNumber('9999999');
      expect(result).to.equal("NINE MILLION NINE HUNDRED AND NINETY NINE THOUSAND NINE HUNDRED AND NINETY NINE DOLLARS");
    });


  });
