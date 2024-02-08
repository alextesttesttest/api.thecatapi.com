/// <reference types="cypress" />

const apiKey = Cypress.env("thecatapi_key");
var apiPath = "";
var cypressTimestamp = "";
var uploadedImageId = "";

describe("tests v1/images/upload API and deletion", () => {
  it("Confirms a local image can be uploaded", () => {
    apiPath = "/v1/images/upload";
    cy.fixture("scottishFold.jpg", "binary").then((file) => {
      // Create a unique id using a timestamp
      const now = new Date();
      cypressTimestamp = "cypress-" + now.toISOString();
      //construct form data
      const blob = Cypress.Blob.binaryStringToBlob(file, "image/jpeg");
      const formData = new FormData();
      formData.append("file", blob, "scottishFold.jpg");
      formData.append("sub_id", cypressTimestamp);
      formData.append("breed_ids", "sfol");
      //send the request
      cy.request({
        method: "POST",
        url: apiPath,
        body: formData,
        headers: { "x-api-key": apiKey, "content-type": "multipart/form-data" },
      }).then((response) => {
        expect(response.status).to.eq(201);
      });
    });
  });

  it("Sense checks the metadata returned by the API of the image that was uploaded", () => {
    apiPath = "/v1/images/";
    cy.request({ url: apiPath, headers: { "x-api-key": apiKey } }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0].sub_id).to.eq(cypressTimestamp);
      expect(response.body[0].height).to.eq(920);
      expect(response.body[0].width).to.eq(736);
      expect(response.body[0].id).to.be.a("string");
      uploadedImageId = response.body[0].id;
    });
  });

  it("Confirms the uploaded image can be deleted", () => {
    apiPath = "/v1/images/" + uploadedImageId;
    cy.request({ method: "DELETE", url: apiPath, headers: { "x-api-key": apiKey } }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it("Confirms valid x-api-key parameter is required for local image upload", () => {
    // test setup almost identical to happy path
    apiPath = "/v1/images/upload";
    cy.fixture("scottishFold.jpg", "binary").then((file) => {
      //Create a unique id using a timestamp
      const now = new Date();
      cypressTimestamp = "cypressInvalid-" + now.toISOString();
      //construct form data
      const blob = Cypress.Blob.binaryStringToBlob(file, "image/jpeg");
      const formData = new FormData();
      formData.append("file", blob, "scottishFold.jpg");
      formData.append("sub_id", cypressTimestamp);
      formData.append("breed_ids", "sfol");
      //send the request
      cy.request({
        method: "POST",
        url: apiPath,
        body: formData,
        headers: { "x-api-key": "invalidKey", "content-type": "multipart/form-data" },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
