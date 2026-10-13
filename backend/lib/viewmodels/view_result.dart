/// Resultado de um caso de uso, decidido pelo ViewModel.
///
/// O ViewModel diz *o que* aconteceu (sucesso com dados, ou falha com status
/// e motivo); a View só transforma isso em resposta HTTP. Assim os ViewModels
/// podem ser testados sem HTTP nenhum.
sealed class ViewResult<T> {
  const ViewResult();
}

class Success<T> extends ViewResult<T> {
  final T data;
  final int status;
  const Success(this.data, {this.status = 200});
}

class Failure<T> extends ViewResult<T> {
  final int status;
  final String message;

  /// Código estável para o cliente tratar o erro sem depender do texto.
  final String code;

  /// Informação extra (ex.: erros por campo, itens sem estoque).
  final Object? details;

  const Failure(this.status, this.code, this.message, {this.details});

  /// Converte para outro tipo de dado (a falha não carrega dados).
  Failure<R> cast<R>() => Failure<R>(status, code, message, details: details);
}

/// Atalhos para as falhas mais comuns.
Failure<T> badRequest<T>(String message, {Object? details}) =>
    Failure<T>(400, 'bad_request', message, details: details);

Failure<T> notFound<T>(String message) => Failure<T>(404, 'not_found', message);

/// Erros de validação de campos: `details` = { campo: mensagem }.
Failure<T> invalidFields<T>(Map<String, String> errors) =>
    Failure<T>(422, 'validation_error', 'Corrija os campos destacados.', details: errors);
