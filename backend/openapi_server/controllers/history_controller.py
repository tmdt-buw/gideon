import connexion
import six

from openapi_server.models.session import Session  # noqa: E501
from openapi_server import util


def end_session(id, user):  # noqa: E501
    """end_session

     # noqa: E501

    :param id: 
    :type id: 
    :param user: 
    :type user: 

    :rtype: None
    """
    return 'do some magic!'


def init_session(id, user):  # noqa: E501
    """init_session

     # noqa: E501

    :param id: 
    :type id: 
    :param user: 
    :type user: 

    :rtype: Session
    """
    return 'do some magic!'
