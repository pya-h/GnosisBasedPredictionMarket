export const ConditionTokenContractData = {
  address: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
  abi: [
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'id',
          type: 'uint256',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'bytes32',
        },
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'payoutNumerators',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'from',
          type: 'address',
        },
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'ids',
          type: 'uint256[]',
        },
        {
          name: 'values',
          type: 'uint256[]',
        },
        {
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'safeBatchTransferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'owners',
          type: 'address[]',
        },
        {
          name: 'ids',
          type: 'uint256[]',
        },
      ],
      name: 'balanceOfBatch',
      outputs: [
        {
          name: '',
          type: 'uint256[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'operator',
          type: 'address',
        },
        {
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'payoutDenominator',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'isApprovedForAll',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'from',
          type: 'address',
        },
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'id',
          type: 'uint256',
        },
        {
          name: 'value',
          type: 'uint256',
        },
        {
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          indexed: true,
          name: 'oracle',
          type: 'address',
        },
        {
          indexed: true,
          name: 'questionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'outcomeSlotCount',
          type: 'uint256',
        },
      ],
      name: 'ConditionPreparation',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          indexed: true,
          name: 'oracle',
          type: 'address',
        },
        {
          indexed: true,
          name: 'questionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'outcomeSlotCount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'payoutNumerators',
          type: 'uint256[]',
        },
      ],
      name: 'ConditionResolution',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'stakeholder',
          type: 'address',
        },
        {
          indexed: false,
          name: 'collateralToken',
          type: 'address',
        },
        {
          indexed: true,
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          indexed: true,
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'partition',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'PositionSplit',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'stakeholder',
          type: 'address',
        },
        {
          indexed: false,
          name: 'collateralToken',
          type: 'address',
        },
        {
          indexed: true,
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          indexed: true,
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'partition',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'PositionsMerge',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'redeemer',
          type: 'address',
        },
        {
          indexed: true,
          name: 'collateralToken',
          type: 'address',
        },
        {
          indexed: true,
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          indexed: false,
          name: 'indexSets',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: 'payout',
          type: 'uint256',
        },
      ],
      name: 'PayoutRedemption',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'operator',
          type: 'address',
        },
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'id',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'TransferSingle',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'operator',
          type: 'address',
        },
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'ids',
          type: 'uint256[]',
        },
        {
          indexed: false,
          name: 'values',
          type: 'uint256[]',
        },
      ],
      name: 'TransferBatch',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'value',
          type: 'string',
        },
        {
          indexed: true,
          name: 'id',
          type: 'uint256',
        },
      ],
      name: 'URI',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'oracle',
          type: 'address',
        },
        {
          name: 'questionId',
          type: 'bytes32',
        },
        {
          name: 'outcomeSlotCount',
          type: 'uint256',
        },
      ],
      name: 'prepareCondition',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'questionId',
          type: 'bytes32',
        },
        {
          name: 'payouts',
          type: 'uint256[]',
        },
      ],
      name: 'reportPayouts',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'collateralToken',
          type: 'address',
        },
        {
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          name: 'partition',
          type: 'uint256[]',
        },
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'splitPosition',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'collateralToken',
          type: 'address',
        },
        {
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          name: 'partition',
          type: 'uint256[]',
        },
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'mergePositions',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'collateralToken',
          type: 'address',
        },
        {
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          name: 'indexSets',
          type: 'uint256[]',
        },
      ],
      name: 'redeemPositions',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'conditionId',
          type: 'bytes32',
        },
      ],
      name: 'getOutcomeSlotCount',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'oracle',
          type: 'address',
        },
        {
          name: 'questionId',
          type: 'bytes32',
        },
        {
          name: 'outcomeSlotCount',
          type: 'uint256',
        },
      ],
      name: 'getConditionId',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'parentCollectionId',
          type: 'bytes32',
        },
        {
          name: 'conditionId',
          type: 'bytes32',
        },
        {
          name: 'indexSet',
          type: 'uint256',
        },
      ],
      name: 'getCollectionId',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'collateralToken',
          type: 'address',
        },
        {
          name: 'collectionId',
          type: 'bytes32',
        },
      ],
      name: 'getPositionId',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
    },
  ],
};
