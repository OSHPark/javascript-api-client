cleanup = ->
  client = new Oshpark.Client
  client.authenticate '@@EMAIL', withApiSecret: '@@API_SECRET'
    .then ->
      client.projects().then (projects)->
        for project in projects
          client.destroyProject project.id

      client.orders().then (orders)->
        for order in orders
          client.cancelOrder order.id

describe 'API Workflow', ->
  before ->
    @timeout 10000
    @client = new Oshpark.Client url: 'https://oshpark.com/api/v1'
    cleanup()

  after ->
    @timeout 10000
    cleanup()

  it 'authenticates', ->
    @timeout 5000
    expect @client.authenticate '@@EMAIL', withApiSecret: '@@API_SECRET'
      .to.be.fulfilled

  # We're not doing uploading at the moment because it's too damn hairy.
  it 'imports a design from a URL', ->
    @timeout 5000
    @client.createImport '@@FIXTURE_URL'
      .then (_import)=>
        expect(_import).to.be.an.instanceOf(Oshpark.Import)
        @importId = _import.id

  it 'processes the import', ->
    @timeout 360000
    @client.projectFromImport @importId
      .then (project)=>
        expect(project).to.be.an.instanceOf(Oshpark.Project)
        @projectId = project.id

  it 'has a valid project', ->
    @timeout 5000
    @client.project @projectId
      .then (project)=>
        expect(project.isNew()).to.be.true
        expect(project.topImage()).to.be.an.instanceOf(Oshpark.Image)
        expect(project.bottomImage()).to.be.an.instanceOf(Oshpark.Image)
        for layer in project.layers()
          expect(layer).to.be.an.instanceOf(Oshpark.Layer)
