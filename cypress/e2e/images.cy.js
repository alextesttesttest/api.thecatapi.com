/// <reference types="cypress" />

const apiKey = Cypress.env("thecatapi_key");
var apiPath = "/v1/images/";

describe("tests v1/images API", () => {
  it("Sense checks the v1/images response fields return expected or commonly-used fields", () => {
    cy.request(apiPath + '0XYvRd7oD').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.keys("height", "id", "url", "width", "breeds");
      expect(response.body.breeds[0]).to.include.keys("description", "id", "name", "reference_image_id", "weight", "wikipedia_url");
      expect(response.body.breeds[0].description).to.be.a("string");
      expect(response.body.breeds[0].id).to.be.a("string");
      expect(response.body.breeds[0].name).to.be.a("string");
      expect(response.body.breeds[0].reference_image_id).to.be.a("string");
      expect(response.body.breeds[0].wikipedia_url).to.match(/^https?:\/\/\S+\.wikipedia\.org\/wiki\/\S+/i);
      expect(response.body.breeds[0].weight).to.have.keys("imperial", "metric");
      expect(response.body.breeds[0].weight.imperial).to.be.a("string");
      expect(response.body.breeds[0].weight.metric).to.be.a("string");
    });
  });

  it("checks the error response for an invalid image request", () => {
    cy.request({ url: apiPath + 'badImage', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.eq("Couldn't find an image matching the passed 'id' of badImage");
    });
  });
});
