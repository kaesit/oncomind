import numpy as np
import torch
import torch.nn as nn
from mol_tree import Vocab, MolTree
from nn_utils import create_var
from jtnn_enc import JTNNEncoder
from jtnn_dec import JTNNDecoder
from mpn import MPN, mol2graph
from jtmpn import JTMPN

from chemutils import enum_assamble, set_atommap, copy_edit_mol, attach_mols, atom_equal, decode_stereo
import rdkit
import rdkit.Chem as Chem
from rdkit import DataStructs
from rdkit.Chem import AllChem
import copy, math

def set_batch_nodeId(node_batch, vocab):
    tot = 0
    for mol_tree in mol_batch:
        for node in mol_tree.nodes:
            node.idx = tot
            node.wid = vocab.get_index(node.smiles)
            tot+=1



class JunctionTreeGraphs(nn.Model):
    def __init__(self, vocab, hidden_size, latent_size, depth, stereo=True):
        super(JunctionTreeGraphs, self).__init__()
        self.vocab = vocab
        self.hidden_size = hidden_size
        self.latent_size = latent_size
        self.depth = depth

        self.embedding = nn.Embedding(vocab.size(), hidden_size)
        


