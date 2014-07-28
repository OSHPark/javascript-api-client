class Oshpark.Import extends Oshpark.modelWithAttributes([ 'id', 'state', 'original_url', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id' ])

  originalUrl:      -> @original_url
  originalFilename: -> @original_filename
  errorMessage:     -> @error_message
  queuedAt:         -> @queued_at
  startedAt:        -> @started_at
  completedAt:      -> @completed_at
  erroredAt:        -> @errored_at
  failedAt:         -> @failed_at
  projectId:        -> @project_id
