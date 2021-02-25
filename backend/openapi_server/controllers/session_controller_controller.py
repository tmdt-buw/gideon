import connexion
import six

from openapi_server.models.action_call import ActionCall  # noqa: E501
from openapi_server.models.session import Session  # noqa: E501
from openapi_server import util


def record_action(id, action_call):  # noqa: E501
    """record_action

     # noqa: E501

    :param id: 
    :type id: 
    :param action_call: 
    :type action_call: dict | bytes

    :rtype: Session
    """
    if connexion.request.is_json:
        action_call = ActionCall.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
