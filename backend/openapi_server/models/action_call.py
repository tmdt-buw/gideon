# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from openapi_server.models.base_model_ import Model
from openapi_server.models.application_action import ApplicationAction
from openapi_server.models.application_state import ApplicationState
from openapi_server import util

from openapi_server.models.application_action import ApplicationAction  # noqa: E501
from openapi_server.models.application_state import ApplicationState  # noqa: E501

class ActionCall(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, action=None, state=None):  # noqa: E501
        """ActionCall - a model defined in OpenAPI

        :param action: The action of this ActionCall.  # noqa: E501
        :type action: ApplicationAction
        :param state: The state of this ActionCall.  # noqa: E501
        :type state: ApplicationState
        """
        self.openapi_types = {
            'action': ApplicationAction,
            'state': ApplicationState
        }

        self.attribute_map = {
            'action': 'action',
            'state': 'state'
        }

        self._action = action
        self._state = state

    @classmethod
    def from_dict(cls, dikt) -> 'ActionCall':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The ActionCall of this ActionCall.  # noqa: E501
        :rtype: ActionCall
        """
        return util.deserialize_model(dikt, cls)

    @property
    def action(self):
        """Gets the action of this ActionCall.


        :return: The action of this ActionCall.
        :rtype: ApplicationAction
        """
        return self._action

    @action.setter
    def action(self, action):
        """Sets the action of this ActionCall.


        :param action: The action of this ActionCall.
        :type action: ApplicationAction
        """

        self._action = action

    @property
    def state(self):
        """Gets the state of this ActionCall.


        :return: The state of this ActionCall.
        :rtype: ApplicationState
        """
        return self._state

    @state.setter
    def state(self, state):
        """Sets the state of this ActionCall.


        :param state: The state of this ActionCall.
        :type state: ApplicationState
        """

        self._state = state
