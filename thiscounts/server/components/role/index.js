'use strict';

const Enum = require('enum');
const graphTools = require('../graph-tools');
const graphModel = graphTools.createGraphModel('user');
const User = require('../../api/user/user.model');

let Roles = new Enum({'OWNS': 200, 'Admin': 100, 'Manager': 50, 'Seller': 10}, { ignoreCase: true });

function Role() {
}

Role.Roles =
  Role.prototype.Roles = Roles;

Role.extractPayer =
  Role.prototype.extractPayer = function (entity) {
};

Role.createRole =
  Role.prototype.createRole = function(user, entity, role, callback) {
  if (!Roles.get(role))
    return callback( new Error(`undefined role ${role} maybe one of ${Roles.enums}`));

  let existing_query = `MATCH (user:user{_id:"${user}"})-[role:ROLE]->(entity{_id:"${entity}"}) return role`;
  let grunt_query = `MATCH (user:user{_id:"${user}"}), (entity{_id:"${entity}"})
                     CREATE (user)-[role:ROLE{name:"${role}"}]->(entity)`;
  let set_query = `MATCH (user:user{_id:"${user}"})-[role:ROLE]->(entity{_id:"${entity}"}) set role.name=${role}`;

  graphModel.query(existing_query, function (err, roles) {
    if (err) return callback(err);
    if (roles.length === 0)
      graphModel.query(grunt_query, callback);
    else if (roles.length === 1)
      return graphModel.query(set_query, callback);
    else
      return callback(new Error(`more then one role for user`));
  });
};

Role.deleteRole = function(user, entity, callback) {
  let delete_query = `MATCH (user:user{_id:"${user}"})-[role:ROLE]->(entity{_id:"${entity}"}) delete role`;
  graphModel.query(delete_query, callback);
};

Role.handleEntityUserRole = function(type, req, res) {
  let me = req.user._id;
  let entity = req.params.entity;
  let role = req.params.role;
  let user = req.params.user;

  if (me === user)
    return handleError(res, new Error(`you may not change your own role`));

  //Check if me is the entity owner, if so apply
  let owner_query = `MATCH (me:user{_id:"${me}"})-[role:ROLE{name:"OWNS"}]->(entity{_id:"${entity}"}) return me, role, entity`;
  graphModel.query(owner_query, function (err, me_owns_entities) {
    if (err) return handleError(res, err);
    if (me_owns_entities.length === 1) {
      //then me is the owner, allow role
      if (type === 'add') {
        Role.createRole(user, entity, role, function (err) {
          if (err) return handleError(res, err);
          return res.status(200).json('ok');
        });
      } else if (type === 'delete') {
        Role.deleteRole(user, entity, function (err) {
          if (err) return handleError(res, err);
          return res.status(200).json('ok');
        });
      }
    }
    else if (me_owns_entities.length > 1) {
      return res.status(404).json(`Unauthorized user ${me}`);
    }
    else if (me_owns_entities.length === 0) {
      let role_query = `MATCH (me:user{_id:"${me}"})-[role:ROLE]->(entity{_id:"${entity}"}) return me, role, entity`;
      graphModel.query(role_query, function (err, me_role_entities) {
        if (err) return handleError(res, err);
        if (me_role_entities.length === 0) {
          return res.status(404).json(`Unauthorized user ${me}`);
        }
        if (me_role_entities.length > 1) {
          return res.status(500).json(`Multi roles error`);
        }

        if (type === 'add') {
          if (Roles.get(me_role_entities[0].role) <= Roles.get(role))
            return res.status(404).json(`Unauthorized - User role can only be set by higher role only`);

          Role.createRole(user, entity, role, function (err) {
            if (err) return handleError(res, err);
            return res.status(200).json('ok');
          })
        } else if (type === 'delete') {
          let user_role_query = `MATCH (me:user{_id:"${user}"})-[role:ROLE]->(entity{_id:"${entity}"}) return role`;
          graphModel.query(user_role_query, function (err, user_role) {
            if (err) return handleError(res, err);
            if (Roles.get(me_role_entities[0].role) <= Roles.get(user_role.name))
              return res.status(404).json(`Unauthorized - User role can only be set by higher role only`);
            Role.deleteRole(user, entity, function (err) {
              if (err) return handleError(res, err);
              return res.status(200).json('ok');
            });
          });
        }
      })
    }
  });
};

Role.entityRoles = function (req, res) {
  let role = req.params.role;
  let entity = req.params.entity;
  let skip = req.params.skip;
  let limit = req.params.limit;

  let query = role ?
    `MATCH (user:user)-[role:ROLE{name=${role}}]->(e{_id:"${entity}"})` :
    `MATCH (user:user)-[role:ROLE]->(e{_id:"${entity}"})`;

  graphModel.query_ids(`${query} RETURN user,role`,
    '', skip, limit, function (err, users_role) {
      if (err) return handleError(res, err);
      let _ids = [];
      let userRoleById = {};
      users_role.forEach(user_role => {
        _ids.push(user_role.user._id);
        userRoleById[user_role.user._id] = user_role.role.properties.name;
      });
      User.find({}).where('_id').in(_ids).exec(function (err, users) {
        if (err) return handleError(res, err);
        let info = [];
        users.forEach(user => {
          info.push({
            user: user,
            role: userRoleById[user._id]
          });
        });
        return res.status(200).json(info);
      });
    })
};

Role.getUserEntityRoles = function (userId, entityId, callback) {
  graphModel.query(`MATCH (user:user{_id:"${entityId}"})-[roles:ROLE]->(e{_id:"${entityId}"}) return roles`,  function (err, roles) {
      if (err) return callback(err);
      return callback(null, roles.map(role=>{Roles.get(role)}));
  })
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}

module.exports = Role;


