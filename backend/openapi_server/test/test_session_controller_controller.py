# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.action_call import ActionCall  # noqa: E501
from openapi_server.models.session import Session  # noqa: E501
from openapi_server.test import BaseTestCase


class TestSessionControllerController(BaseTestCase):
    """SessionControllerController integration test stubs"""

    def test_record_action(self):
        """Test case for record_action

        
        """
        action_call = {
  "action" : {
    "id" : "046b6c7f-0b8a-43b9-b35d-6489e6daee91",
    "source" : "046b6c7f-0b8a-43b9-b35d-6489e6daee91",
    "time" : "2000-01-23T04:56:07.000+00:00",
    "type" : "type",
    "parameters" : "{}",
    "target" : "046b6c7f-0b8a-43b9-b35d-6489e6daee91"
  },
  "state" : {
    "preview" : "preview",
    "component" : "component",
    "created" : "2000-01-23T04:56:07.000+00:00",
    "id" : "046b6c7f-0b8a-43b9-b35d-6489e6daee91",
    "parameters" : "{}"
  }
}
        headers = { 
            'Accept': '*/*',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/api/gideon/api/gideon/sessions/{id}/actions'.format(id='id_example'),
            method='POST',
            headers=headers,
            data=json.dumps(action_call),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
