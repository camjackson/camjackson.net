'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;
const moment = require('moment');
const Q = require('q');

const createOrUpdatePost = require('../src/createOrUpdatePost');
const Posts = require('../src/db').Posts;

describe('createOrUpdatePost', () => {
  let sandbox;
  let response;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    response = {
      render: sandbox.spy(),
      redirect: sandbox.spy(),
      send: sandbox.spy(),
      status: sandbox.spy()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  const oldPost = {
    slug: 'the-slug',
    posted: '2015-03-05',
    title: 'Old Title',
    text: 'Old text.'
  };
  const requestBody = {
    title: 'New Title',
    slug: 'the-slug',
    text: 'New text.'
  };
  const promise = Q.fcall(() => {});

  it('errors if no slug is given', () => {
    sandbox.spy(Posts, 'findAll');

    createOrUpdatePost({body: {title: 'Hey', text: 'Sup.'}}, response);

    expect(Posts.findAll).not.to.have.been.called;
    expect(response.status).to.have.been.calledWithExactly(400);
    expect(response.send).to.have.been.calledWithExactly('You need to give a slug');
  });

  it('updates the post if it already exists', () => {
    sandbox.stub(Posts, 'findAll').returns(Q.fcall(() => ([oldPost])));
    sandbox.stub(Posts, 'update').returns(promise);

    return createOrUpdatePost({body: requestBody}, response).then(() => {
      expect(Posts.update).to.have.been.calledWithExactly(
        { hash: 'the-slug', range: '2015-03-05' }, { title: 'New Title', text: 'New text.' });
      expect(response.redirect).to.have.been.calledWithExactly(303, '/post/the-slug');
    });
  });

  it('creates the post if it does not already exist', () => {
    sandbox.stub(Posts, 'findAll').returns(Q.fcall(() => ([])));
    sandbox.stub(Posts, 'insert').returns(promise);
    sandbox.useFakeTimers(1451337115429);
    const formattedDate = moment(1451337115429).format();

    return createOrUpdatePost({body: requestBody}, response).then(() => {
      expect(Posts.insert).to.have.been.calledWithExactly({
        slug: 'the-slug',
        posted: formattedDate,
        title: 'New Title',
        text: 'New text.'
      });
      expect(response.redirect).to.have.been.calledWithExactly(303, '/post/the-slug');
    })
  });
});
