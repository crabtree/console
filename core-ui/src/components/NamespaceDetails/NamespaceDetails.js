import React from 'react';
import PropTypes from 'prop-types';
import './NamespaceDetails.scss';

import { useQuery } from '@apollo/react-hooks';
import { GET_NAMESPACE } from 'gql/queries';

import { ResourceNotFound, YamlEditorProvider } from 'react-shared';
import NamespaceDetailsHeader from './NamespaceDetailsHeader/NamespaceDetailsHeader';
import NamespaceWorkloads from './NamespaceWorkloads/NamespaceWorkloads';
import NamespaceApplications from './NamespaceApplications/NamespaceApplications';
import LimitRanges from './LimitRanges/LimitRanges';
import ResourceQuotas from './ResourceQuotas/ResourceQuotas';

NamespaceDetails.propTypes = { name: PropTypes.string.isRequired };

export default function NamespaceDetails({ name }) {
  const { data, error, loading } = useQuery(GET_NAMESPACE, {
    variables: { name },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const { namespace, resourceQuotas, limitRanges } = data;

  if (!namespace) {
    return (
      <ResourceNotFound
        resource="Namespace"
        breadcrumb="Namespaces"
        path="/"
        fromClosestContext={false}
      />
    );
  }

  return (
    <YamlEditorProvider>
      <NamespaceDetailsHeader namespace={namespace} />
      <section id="ns-details-grid">
        <NamespaceWorkloads namespace={namespace} />
        <NamespaceApplications namespace={namespace} />
        <ResourceQuotas
          resourceQuotas={resourceQuotas}
          namespaceName={namespace.name}
        />
        <LimitRanges limitRanges={limitRanges} namespaceName={namespace.name} />
      </section>
    </YamlEditorProvider>
  );
}
