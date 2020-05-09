package br.edu.ifpe.recife.labgeo.sigabem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Estimation {

	private Integer linha;
	private String nome;
	private String chegada;
}
