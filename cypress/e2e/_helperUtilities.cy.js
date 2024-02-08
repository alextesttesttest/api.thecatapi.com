/// <reference types="cypress" />

const apiKey = Cypress.env("thecatapi_key");
var apiPath = "";
var uploadedIds = [];

describe("not actual tests, but some utilities to assist test development", () => {
  it("shows all uploaded images", () => {
    apiPath = "/v1/images?limit=25";
    cy.request({ url: apiPath, headers: { "x-api-key": apiKey } }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(response.body);
      cy.wrap(response.body).each((el) => {
        cy.log("Found: " + el.id);
        uploadedIds.push(el.id);
      });
    });
  });

  it("Deletes all uploaded image", () => {
    apiPath = "/v1/images/";
    uploadedIds.forEach((id) => {
      cy.log("Deleting id " + id);
      apiPath = `/v1/images/${id}`;
      cy.request({ method: "DELETE", url: apiPath, headers: { "x-api-key": apiKey } }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });
  });

  it.skip("Deletes an uploaded image", () => {
    apiPath = "/v1/images/U7tXJwT04";
    cy.request({ method: "DELETE", url: apiPath, headers: { "x-api-key": apiKey } }).then((response) => {
      expect(response.status).to.eq(204);
      cy.log(response.body);
    });
  });
});
