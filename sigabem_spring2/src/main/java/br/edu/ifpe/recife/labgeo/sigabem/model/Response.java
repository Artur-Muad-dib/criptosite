package br.edu.ifpe.recife.labgeo.sigabem.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {
	private String message;
	private String error;
}
