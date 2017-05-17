import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { provideHooks } from 'redial';
import withStyles from 'nebo15-isomorphic-style-loader/lib/withStyles';

import FormPageWrapper from 'containers/blocks/FormPageWrapper';
import RoleForm from 'containers/forms/RoleForm';

import { getRole } from 'reducers';
import { fetchRoleByID, updateRole } from 'redux/roles';
import { deleteRole } from './redux';

import styles from './styles.scss';

@provideHooks({
  fetch: ({ dispatch, params: { id } }) => dispatch(fetchRoleByID(id)),
})
@connect((state, { params: { id } }) => ({
  role: getRole(state, id),
}), { updateRole, deleteRole })
@withStyles(styles)
@translate()
export default class CreateRolePage extends React.Component {
  render() {
    const { t, role, updateRole, deleteRole } = this.props;

    return (
      <FormPageWrapper id="update-roles-page" title={t('Edit {{name}} role', { name: role.name })} back="/roles">
        <div className={styles.block}>
          <RoleForm
            initialValues={role}
            onSubmit={values => updateRole(role.id, values)}
            onDelete={deleteRole}
            edit
          />
        </div>
      </FormPageWrapper>
    );
  }
}
