/**
 * A User
 * @typedef {object} User
 * @property {integer} id - User ID
 * @property {string} email.required - User email
 * @property {string} username.required - Username
 * @property {string} phone.required - Phone number
 * @property {boolean} status - User status
 * @property {string} remark - User remark
 * @property {array<UserRole>} roles - User roles
 */

/**
 * A Role
 * @typedef {object} Role
 * @property {integer} id - Role ID
 * @property {string} name.required - Role name
 * @property {string} description - Role description
 * @property {integer} sort - Sort order
 * @property {string} remark - Role remark
 * @property {array<Permission>} permissions - Role permissions
 */

/**
 * A Permission
 * @typedef {object} Permission
 * @property {integer} id - Permission ID
 * @property {string} name.required - Permission name
 * @property {string} description - Permission description
 */

/**
 * A Menu
 * @typedef {object} Menu
 * @property {integer} id - Menu ID
 * @property {string} name.required - Menu name
 * @property {string} code.required - Menu code
 * @property {integer} parentId - Parent menu ID
 * @property {integer} sort - Sort order
 * @property {string} remark - Menu remark
 */

/**
 * User Role
 * @typedef {object} UserRole
 * @property {integer} id - UserRole ID
 * @property {integer} userId - User ID
 * @property {integer} roleId - Role ID
 * @property {Role} role - Role info
 */

/**
 * Update User Input
 * @typedef {object} UpdateUserInput
 * @property {string} username - New username
 * @property {string} email - New email
 * @property {string} phone - New phone number
 * @property {boolean} status - New status
 * @property {string} remark - New remark
 */

/**
 * Assign Role Input
 * @typedef {object} AssignRoleInput
 * @property {array<integer>} roleIds.required - Role IDs to assign
 */

/**
 * Create Role Input
 * @typedef {object} CreateRoleInput
 * @property {string} name.required - Role name
 * @property {string} description - Role description
 * @property {integer} sort - Sort order
 * @property {string} remark - Role remark
 * @property {array<integer>} permissionIds - Permission IDs
 * @property {array<integer>} menuIds - Menu IDs
 */

/**
 * Create Menu Input
 * @typedef {object} CreateMenuInput
 * @property {string} name.required - Menu name
 * @property {string} code.required - Menu code
 * @property {integer} parentId - Parent menu ID
 * @property {integer} sort - Sort order
 * @property {string} remark - Menu remark
 */