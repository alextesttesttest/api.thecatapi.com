/// <reference types="cypress" />
import { testSearchApiResponses } from "../page-objects/commonTests.js";

const apiKey = Cypress.env("thecatapi_key");
const apiPath = "/v1/images/search";
var imageReturned = {};

describe("tests v1/images/search API", () => {
  it("Sense checks the v1/images/search response fields", () => {
    cy.request(apiPath).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.keys("height", "id", "url", "width");
      expect(response.body[0].height).to.be.a("number");
      expect(response.body[0].width).to.be.a("number");
      expect(response.body[0].id).to.be.a("string");
      expect(response.body[0].url).to.match(/^https:\/\/.*\.thecatapi\.com\//i);
      imageReturned.url = response.body[0].url;
      imageReturned.width = response.body[0].width;
      imageReturned.height = response.body[0].height;
    });
  });

  it("confirms the image at the URL returned by the API has expected dimensions", () => {
    const img = new Image();
    img.src = imageReturned.url;
    img.onload = () => {
      expect(img.naturalWidth).to.equal(imageReturned.width);
      expect(img.naturalHeight).to.equal(imageReturned.height);
    };
  });

  it("confirms 'limit' query parameter returns expected number of results", () => {
    cy.request({
      url: apiPath + "?limit=25",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(25);
      cy.log(response.body);
    });
  });

  it("confirms 'has_breeds' query parameter returns expected or commonly-used fields", () => {
    cy.request({
      url: apiPath + "?has_breeds=true",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      testSearchApiResponses(response);
    });

    it("confirms 'breed_ids' query parameter returns expected or commonly-used fields", () => {
      cy.request({
        url: apiPath + "?breed_ids=beng",
        headers: { "x-api-key": apiKey },
      }).then((response) => {
        testSearchApiResponses(response);
      });
    });
  });
});
