import { APIError, type CollectionConfig } from 'payload'

import { adminField, isAdmin, isAdminUser, isStaff, selfOrAdmin } from '@/access'
import { ADMIN, EDITOR, ROLE_OPTIONS } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
    tokenExpiration: 8 * 60 * 60, // one working day
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active'],
    group: 'Admin',
    hidden: ({ user }) => !isAdminUser(user as never),
  },
  access: {
    admin: isStaff,
    read: selfOrAdmin,
    create: isAdmin,
    update: selfOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account (created on the /admin "create first user" screen) is the admin.
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = ADMIN
        }
        return data
      },
    ],
    beforeLogin: [
      ({ user }) => {
        if (user.active === false) throw new APIError('This account is disabled.', 403, null, true)
        return user
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: EDITOR,
      options: ROLE_OPTIONS,
      saveToJWT: true,
      // No self-promotion: only an admin can set or change a role.
      access: { create: adminField, update: adminField },
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      saveToJWT: true,
      access: { create: adminField, update: adminField },
      admin: { position: 'sidebar', description: 'Untick to disable this account the day someone leaves.' },
    },
  ],
}
