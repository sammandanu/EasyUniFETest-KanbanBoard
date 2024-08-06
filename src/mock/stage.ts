import mock from './mock'
import data1 from './json/contacts-stage-018f3d6b-335e-7c8e-b5c7-7792b3ee9f15.json'
import data2 from './json/contacts-stage-018f3d6b-a5b7-7124-b0d0-cf5a081f869b.json'
import data3 from './json/contacts-stage-018f3d6c-74b0-76ee-8896-ec7d51d576df.json'

mock.onGet(/\/stage\/\d+/).reply((config) => {
  const id = config.url?.split('/')[2]

  if (id) {
    switch (id) {
      case '018f3d6b-335e-7c8e-b5c7-7792b3ee9f15':
        return [200, data1]
      case '018f3d6b-a5b7-7124-b0d0-cf5a081f869b':
        return [200, data2]
      case '018f3d6c-74b0-76ee-8896-ec7d51d576df':
        return [200, data3]
      default:
        return [404, { message: 'Not Found' }]
    }
  }
  return [404, { message: 'Not Found' }]
})
