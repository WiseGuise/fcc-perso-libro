/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let bookID;
suite("Functional Tests", function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function(done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function() {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function() {
        // User Story #1 -- You can send a POST request to /api/books with title as part of the

        test("Test POST /api/books with title", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({
              title: "test-title"
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              bookID = res.body._id;
              assert.equal(res.body.title, "test-title");

              done();
            });
        });

        // User Story #2 -- If title is not included in the request, the returned response should be
        // the string missing required field title.

        test("Test POST /api/books with no title given", function(done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field title");

              done();
            });
        });
      }
    );

    // User Story #3 -- You can send a GET request to /api/books and receive a JSON response representing
    // all the books. The JSON response will be an array of objects with each object (book)
    // containing title, _id, and commentcount properties.

    suite("GET /api/books => array of books", function() {
      test("Test GET /api/books", function(done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "it is an array");

            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function() {
      // User Story #4 -- If no book is found, return the string no book exists.

      test("Test GET /api/books/[id] with id not in db", function(done) {
        chai
          .request(server)
          .get("/api/books/invalidID")
          .set("content-type", "application/json")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");

            done();
          });
      });

      // User Story #5 -- You can send a GET request to /api/books/{_id} to retrieve a single object of a book
      // containing the properties title, _id, and a comments array (empty array if no comments present).

      test("Test GET /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .get("/api/books/" + bookID)
          
          
          
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "test-title");

            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function() {
        // User Story #6 -- You can send a POST request containing comment as the form body data to /api/books/{_id}
        // to add a comment to a book. The returned response will be the books object similar to GET /api/books/{_id}
        // request in an earlier test.
        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + bookID)
            .send({ comment: "test-comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.comments[0], "test-comment");

              done();
            });
        });

        test("Test POST /api/books/[id] with comment", function(done) {
          chai
            .request(server)
            .post("/api/books/" + bookID)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");

              done();
            });
        });

        // If comment is not included in the request, return the string missing required field comment.

        test("Test POST /api/books/[id] without comment field", function(done) {
          chai
            .request(server)
            .post("/api/books/" + bookID)
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "missing required field comment");

              done();
            });
        });

        // If no book is found, return the string no book exists.

        test("Test POST /api/books/[id] with comment, id not in db", function(done) {
          chai
            .request(server)
            .post("/api/books/invalidID")
            .send({ comment: "test-comment" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.text, "no book exists");

              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function() {
      // You can send a DELETE request to /api/books/{_id} to delete a book from the collection.
      // The returned response will be the string delete successful if successful. If no book is found,
      // return the string "no book exists".

      test("Test DELETE /api/books/[id] with valid id in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/" + bookID)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");

            done();
          });
      });

      //You can send a DELETE request to /api/books to delete all books in the database. The returned
      // response will be the string 'complete delete successful if successful.

      test("Test DELETE /api/books/[id] with  id not in db", function(done) {
        chai
          .request(server)
          .delete("/api/books/invalidID")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");

            done();
          });
      });
    });
  });
});
