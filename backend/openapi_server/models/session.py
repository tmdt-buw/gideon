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

class Session(Model):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.
    """

    def __init__(self, id=None, actions=None, states=None, expires_in=None):  # noqa: E501
        """Session - a model defined in OpenAPI

        :param id: The id of this Session.  # noqa: E501
        :type id: str
        :param actions: The actions of this Session.  # noqa: E501
        :type actions: List[ApplicationAction]
        :param states: The states of this Session.  # noqa: E501
        :type states: List[ApplicationState]
        :param expires_in: The expires_in of this Session.  # noqa: E501
        :type expires_in: int
        """
        self.openapi_types = {
            'id': str,
            'actions': List[ApplicationAction],
            'states': List[ApplicationState],
            'expires_in': int
        }

        self.attribute_map = {
            'id': 'id',
            'actions': 'actions',
            'states': 'states',
            'expires_in': 'expiresIn'
        }

        self._id = id
        self._actions = actions
        self._states = states
        self._expires_in = expires_in

    @classmethod
    def from_dict(cls, dikt) -> 'Session':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Session of this Session.  # noqa: E501
        :rtype: Session
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self):
        """Gets the id of this Session.


        :return: The id of this Session.
        :rtype: str
        """
        return self._id

    @id.setter
    def id(self, id):
        """Sets the id of this Session.


        :param id: The id of this Session.
        :type id: str
        """
        if id is None:
            raise ValueError("Invalid value for `id`, must not be `None`")  # noqa: E501

        self._id = id

    @property
    def actions(self):
        """Gets the actions of this Session.


        :return: The actions of this Session.
        :rtype: List[ApplicationAction]
        """
        return self._actions

    @actions.setter
    def actions(self, actions):
        """Sets the actions of this Session.


        :param actions: The actions of this Session.
        :type actions: List[ApplicationAction]
        """
        if actions is None:
            raise ValueError("Invalid value for `actions`, must not be `None`")  # noqa: E501

        self._actions = actions

    @property
    def states(self):
        """Gets the states of this Session.


        :return: The states of this Session.
        :rtype: List[ApplicationState]
        """
        return self._states

    @states.setter
    def states(self, states):
        """Sets the states of this Session.


        :param states: The states of this Session.
        :type states: List[ApplicationState]
        """
        if states is None:
            raise ValueError("Invalid value for `states`, must not be `None`")  # noqa: E501

        self._states = states

    @property
    def expires_in(self):
        """Gets the expires_in of this Session.


        :return: The expires_in of this Session.
        :rtype: int
        """
        return self._expires_in

    @expires_in.setter
    def expires_in(self, expires_in):
        """Sets the expires_in of this Session.


        :param expires_in: The expires_in of this Session.
        :type expires_in: int
        """
        if expires_in is None:
            raise ValueError("Invalid value for `expires_in`, must not be `None`")  # noqa: E501

        self._expires_in = expires_in
