class ResponseView {
  static success(data, message = null, statusCode = 200) {
    const response = {
      success: true,
      data
    };
    
    if (message) {
      response.message = message;
    }
    
    return { response, statusCode };
  }

  static error(error, statusCode = 500) {
    return {
      response: {
        success: false,
        error: typeof error === 'string' ? error : error.message
      },
      statusCode
    };
  }

  static paginated(data, pagination) {
    return {
      response: {
        success: true,
        data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: Math.ceil(pagination.total / pagination.limit)
        }
      },
      statusCode: 200
    };
  }

  static created(data, message = 'Criado com sucesso') {
    return {
      response: {
        success: true,
        data,
        message
      },
      statusCode: 201
    };
  }

  static notFound(message = 'Recurso não encontrado') {
    return {
      response: {
        success: false,
        error: message
      },
      statusCode: 404
    };
  }

  static unauthorized(message = 'Não autorizado') {
    return {
      response: {
        success: false,
        error: message
      },
      statusCode: 401
    };
  }

  static forbidden(message = 'Acesso negado') {
    return {
      response: {
        success: false,
        error: message
      },
      statusCode: 403
    };
  }

  static validationError(errors) {
    return {
      response: {
        success: false,
        error: 'Dados inválidos',
        details: errors
      },
      statusCode: 400
    };
  }
}

module.exports = ResponseView;