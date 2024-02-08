/// <reference types="cypress" />

const apiKey = Cypress.env("thecatapi_key");
const apiPath = "v1/breeds";

describe("tests v1/breeds API", () => {
  it("Sense checks an important subset of /breeds API response fields, for all breeds", () => {
    cy.request(apiPath).then((response) => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body).each((el) => {
        expect(el).to.include.keys("id", "name");
        expect(el.id).to.be.a("string");
        expect(el.name).to.be.a("string");
      });
    });
  });

  it("confirms error response for an invalid breed", () => {
    cy.request({ url: apiPath + "/invalidBreed", failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.eq("INVALID_DATA");
    });
  });
});
