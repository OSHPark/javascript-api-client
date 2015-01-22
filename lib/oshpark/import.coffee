`import modelWithAttributes from 'oshpark/model_with_attributes'`

class Import extends modelWithAttributes([ 'id', 'state', 'original_url', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id' ])

  isWaiting:    -> @state == 'WAITING'
  isRunning:    -> @state == 'RUNNING'
  isSuccessful: -> @state == 'SUCCESS'
  hasErrored:   -> @state == 'ERROR'
  hasFailed:    -> @state == 'FAILED'

  isProcessing: -> @isWaiting() || @isRunning()
  isFinished:   -> @isSuccessful() || @hasErrored() || @hasFailed()

`export default Import`
