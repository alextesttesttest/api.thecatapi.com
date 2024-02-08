/// <reference types="cypress" />

export function testSearchApiResponses(resp) {
  expect(resp.status).to.eq(200);
  expect(resp.body[0]).to.have.keys("height", "id", "url", "width", "breeds");
  expect(resp.body[0].breeds[0]).to.include.keys("description", "id", "name", "reference_image_id", "weight", "wikipedia_url");
  expect(resp.body[0].breeds[0].description).to.be.a("string");
  expect(resp.body[0].breeds[0].id).to.be.a("string");
  expect(resp.body[0].breeds[0].name).to.be.a("string");
  expect(resp.body[0].breeds[0].reference_image_id).to.be.a("string");
  expect(resp.body[0].breeds[0].wikipedia_url).to.match(/^https?:\/\/\S+\.wikipedia\.org\/wiki\/\S+/i);
  expect(resp.body[0].breeds[0].weight).to.have.keys("imperial", "metric");
  expect(resp.body[0].breeds[0].weight.imperial).to.be.a("string");
  expect(resp.body[0].breeds[0].weight.metric).to.be.a("string");
}
