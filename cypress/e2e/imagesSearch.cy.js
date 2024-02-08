/// <reference types="cypress" />

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
      expect(response.status).to.eq(200);
      expect(response.body[0]).to.have.keys("height", "id", "url", "width", "breeds");
      expect(response.body[0].breeds[0]).to.include.keys("description", "id", "name", "reference_image_id", "weight", "wikipedia_url");
      expect(response.body[0].breeds[0].description).to.be.a("string");
      expect(response.body[0].breeds[0].id).to.be.a("string");
      expect(response.body[0].breeds[0].name).to.be.a("string");
      expect(response.body[0].breeds[0].reference_image_id).to.be.a("string");
      expect(response.body[0].breeds[0].wikipedia_url).to.match(/^https?:\/\/\S+\.wikipedia\.org\/wiki\/\S+/i);
      expect(response.body[0].breeds[0].weight).to.have.keys("imperial", "metric");
      expect(response.body[0].breeds[0].weight.imperial).to.be.a("string");
      expect(response.body[0].breeds[0].weight.metric).to.be.a("string");
    });
  });

  it.only("confirms 'breed_ids' query parameter returns expected or commonly-used fields", () => {
    cy.request({
      url: apiPath + "?breed_ids=beng",
      headers: { "x-api-key": apiKey },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(response.body);
      // Work in progress - move these to a POM function
      expect(response.body[0]).to.have.keys("height", "id", "url", "width", "breeds");
      expect(response.body[0].breeds[0]).to.include.keys("description", "id", "name", "reference_image_id", "weight", "wikipedia_url");
      expect(response.body[0].breeds[0].description).to.be.a("string");
      expect(response.body[0].breeds[0].id).to.be.a("string");
      expect(response.body[0].breeds[0].name).to.be.a("string");
      expect(response.body[0].breeds[0].reference_image_id).to.be.a("string");
      expect(response.body[0].breeds[0].wikipedia_url).to.match(/^https?:\/\/\S+\.wikipedia\.org\/wiki\/\S+/i);
      expect(response.body[0].breeds[0].weight).to.have.keys("imperial", "metric");
      expect(response.body[0].breeds[0].weight.imperial).to.be.a("string");
      expect(response.body[0].breeds[0].weight.metric).to.be.a("string");
    });
  });
});
