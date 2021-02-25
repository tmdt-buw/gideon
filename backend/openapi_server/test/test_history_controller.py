# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from openapi_server.models.session import Session  # noqa: E501
from openapi_server.test import BaseTestCase


class TestHistoryController(BaseTestCase):
    """HistoryController integration test stubs"""

    def test_end_session(self):
        """Test case for end_session

        
        """
        query_string = [('user', 'user_example')]
        headers = { 
        }
        response = self.client.open(
            '/api/gideon/api/gideon/histories/{id}/sessions/end'.format(id='id_example'),
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_init_session(self):
        """Test case for init_session

        
        """
        query_string = [('user', 'user_example')]
        headers = { 
            'Accept': '*/*',
        }
        response = self.client.open(
            '/api/gideon/api/gideon/histories/{id}/sessions/init'.format(id='id_example'),
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
