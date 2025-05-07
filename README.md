# trm-action-install

This action can be used to install an ABAP package from TRM Registry.

## Runner Requirements

The runner used for this action must have these requirements:
- Can reach your development SAP system (RFC/REST)
- Can reach the TRM Registry
- Must have installed
    - Node.Js
    - [SAP NW RFC SDK](https://docs.trmregistry.com/#/client/docs/setup?id=sap-nw-rfc-sdk) (if connecting via RFC)
    - [R3Trans program](https://docs.trmregistry.com/#/client/docs/setup?id=r3trans-program)

## Usage

To view an example of usage, refer to [this article](https://docs.trmregistry.com/#/client/docs/examples/githubActions).

### REST connection

```
- name: Checkout R3trans
  uses: actions/checkout@v2
  with:
    repository: PRIVATE/R3TRANS_REPO
    token: ${{ secrets.GITHUB_TOKEN }}
    path: r3trans
- name: TRM install package
  uses: RegestaItalia/trm-action-install@latest
  with:
    r3transDirPath: './r3trans'
    systemRESTEndpoint: ${{ vars.ENDPOINT }}
    systemLoginUser: ${{ vars.USERNAME }}
    systemLoginPassword: ${{ secrets.PASSWORD }}
    systemLoginLanguage: 'EN'
    name: 'myPackage'
    version: 'latest'
    registryToken: ${{ secrets.TRM_TOKEN }}
    overwrite: true
    keepOriginalAbapPackages: true
    createInstallTransport: true
    installTransportTargetSystem: 'TRM'
```

### RFC connection

```
- name: Checkout R3trans
  uses: actions/checkout@v2
  with:
    repository: PRIVATE/R3TRANS_REPO
    token: ${{ secrets.GITHUB_TOKEN }}
    path: r3trans
- name: TRM install package
  uses: RegestaItalia/trm-action-install@latest
  with:
    r3transDirPath: './r3trans'
    systemRFCDest: ${{ vars.DEST }}
    systemRFCAsHost: ${{ vars.ASHOST }}
    systemRFCSysnr: ${{ vars.SYSNR }}
    systemRFCSAPRouter: ${{ vars.SAPROUTER }}
    systemLoginClient: ${{ vars.CLIENT }}
    systemLoginUser: ${{ vars.USERNAME }}
    systemLoginPassword: ${{ secrets.PASSWORD }}
    systemLoginLanguage: 'EN'
    name: 'myPackage'
    version: 'latest'
    registryToken: ${{ secrets.TRM_TOKEN }}
    overwrite: true
    keepOriginalAbapPackages: true
    createInstallTransport: true
    installTransportTargetSystem: 'TRM'
```

# Contributing <!-- {docsify-remove} -->

Like every other TRM open-soruce projects, contributions are always welcomed ❤️.

Make sure to open an issue first.

Contributions will be merged upon approval.

[Click here](https://docs.trmregistry.com/#/CONTRIBUTING) for the full list of TRM contribution guidelines.

[<img src="https://trmregistry.com/public/contributors?image=true">](https://docs.trmregistry.com/#/?id=contributors)
