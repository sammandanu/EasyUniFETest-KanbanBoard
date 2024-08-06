import mock from './mock'
import stagesResponse from './json/stages.json'

const response = stagesResponse

mock.onGet('/stages').reply((config) => {
  return [200, response]
})
