export const Routes = {
  home: '/',

  login: '/login',
  register: '/register',

  client: {
    profile: '/client',

    appeals: '/client/appeal',
    appeal: (id: string) => `/client/appeal/${id}`,

    createAppeal: '/client/appeal/create',
  },

  supporter: {
    profile: '/supporter',
  },
  admin: {
    profile: '/admin',
  },
}
