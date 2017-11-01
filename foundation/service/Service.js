import _ from 'lodash';
import HTTPClient from 'request';
import chalk from 'chalk';
import pathToRegExp from 'path-to-regexp';
import restful, { requestBackend } from 'restful.js';


class Service {
  constructor(request, endpoints = {}, services = {}) {
    this.endpoints = endpoints;
    this.request = request;
    this.restful = {};
    this.services = services;
  }

  api(name) {
    if ( ! this.restful[name]) {
      const endpoint = this.endpoint[name];
      const api = restful(endpoint.baseUrl, requestBackend(HTTPClient));

      api.addRequestInterceptor((request) => {
        if (/application\/json/.test(request.headers['Content-Type'])) {
          request.body = request.data;
          request.json = true;
          request.data = null;
        }

        return request;
      });

      api.on('request', (request) => {
        let absoluteUrl = request.url;

        if (request.params) {
          const path = Object.entries(request.params).map(([key, value]) => `${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`).join('&');

          absoluteUrl += `?${ path }`;
        }

        // eslint-disable-next-line no-console
        console.info(chalk.yellow('-'.repeat(80)));
        // eslint-disable-next-line no-console
        console.info(chalk.green(`[${ request.method }] ${ absoluteUrl }`));
        // eslint-disable-next-line no-console
        console.info(chalk.yellow(` (header) ${ JSON.stringify(request.headers) }`));

        if (request.body) {
          if (request.body.password) {
            request.body.password = '*'.repeat(12);
          }

          // eslint-disable-next-line no-console
          console.info(` (body) ${ JSON.stringify(request.body) }`);
        }

        // eslint-disable-next-line no-console
        console.info(chalk.yellow('-'.repeat(80)));
      });

      this.restful[name] = api;
    }

    return this.restful[name];
  }

  execute(name, { params = {}, queries = {}, payloads = {}, headers = {} } = {}) {
    const service = this.services[name];

    if ( ! service) {
      throw new ReferenceError(`[Service Module] Service "${ name }" not found.`);
    }

    if ( ! service.endpoint) {
      throw new ReferenceError(`[Service Module] Endpoint name for "${ name }" is required.`);
    }

    if ( ! service.path) {
      throw new ReferenceError(`[Service Module] Path for "${ name }" is required.`);
    }

    const compiler = pathToRegExp.compile(service.path);
    const path = compiler(params).replace(/%2F/g, '/');

    if (service.payloads && service.payloads.length > 0) {
      const difference = _.difference(service.payloads, Object.keys(payloads));

      if (difference.length > 0) {
        throw new ReferenceError(`[Service Module] Payload "${ difference.join('", "') }" is required.`);
      }
    }

    if (service.queries) {
      const difference = _.difference(service.queries, Object.keys(queries));

      if (difference.length > 0) {
        throw new ReferenceError(`[Service Module] Query "${ difference.join('", "') }" is required.`);
      }
    }

    const method = service.method || 'GET';
    const api = this.api(service.endpoint);

    if (this.request.session && this.request.session.service && this.request.session.service.headers) {
      // eslint-disable-next-line no-param-reassign
      headers = Object.assign(this.request.session.service.headers, headers);
    }

    if (service.options) {
      if (service.options.headers) {
        Object.entries(service.options.headers).map(([key, value]) => {
          // eslint-disable-next-line no-param-reassign
          headers[key] = value;

          return headers;
        });
      }
    }

    switch (method.toUpperCase()) {
      case 'GET':
        return api.custom(path).get(queries, headers);
      case 'POST':
        return api.custom(path).post(payloads, queries, headers);
      case 'PUT':
        return api.custom(path).put(payloads, queries, headers);
      case 'PATCH':
        return api.custom(path).patch(payloads, queries, headers);
      case 'HEAD':
        return api.custom(path).head(queries, headers);
      default:
        throw new ReferenceError(`[Service Module] Method "${ method }" is not supported.`);
    }
  }
}

export default Service;
